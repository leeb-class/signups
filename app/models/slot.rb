class Slot < ApplicationRecord

    #---Associations---
    belongs_to :ta, class_name: "User",
    foreign_key: "ta_id"
    belongs_to :student, class_name: "User",
    foreign_key: "student_id"
    belongs_to :event

    #---Attributes---
    #attr_accessible :location, :start_time

    #---Validations---
    validates :ta, :presence=>true
    validates :location, :presence=>true
    validate :ta_not_overcomitted

    def ta_not_overcomitted
        return false if not ta
        num_slots =  Slot.where(:ta_id=>ta.id,:start_time=>start_time).count
        num_slots+=1 if self.id.blank? #if this is a new slot its not included in this count

        if num_slots > event.students_per_slot
            errors.add(:ta, "already registered for this slot");
            return false
        end
    end
    #################
  # Object Methods
  #
  
  #--- custom overrides ----
  def as_json(options)
    limited_info = false
    if options[:limited]
      #hide full information about slots from students
      if self.student != nil
        if options[:student]==student
          limited_info = false
        else
          limited_info=true
        end
      else
        limited_info = true
      end
    else
      limited_info = false
    end    
    #####
    if limited_info
      slot = super(:except=>[:ta_id, :location]) 
      slot[:student] = self.student.as_json(options)
      return slot
    else #return full information about the slot
      slot = super(options) 
      slot[:ta] = self.ta.as_json(options)
      slot[:student] = self.student.as_json(options)
      return slot
    end
  end


end
