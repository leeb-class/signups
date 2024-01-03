class Event < ActiveRecord::Base

    #---Associations---
    has_many :slots, dependent: :destroy
    has_many :submissions, dependent: :destroy
    
    #---Attributes---
    attr_accessible :start_date, :end_date, :black_out_times, :name, :slot_length, :visible,
                    :students_per_slot, :has_submissions, :submission_deadline
    
    #---Scopes---
    scope :active, -> {where(visible:true).where("end_date > ?",Time.now)}
    #---Validations---
    validates :name, :presence=>true, :uniqueness=>true
    validates :start_date, :end_date, :students_per_slot, :presence=>true
    validates :end_date, :presence=>true
    validates :slot_length, inclusion: {in: [5,10,15,20,30,40,45,60]}
    validates :students_per_slot, numericality: { only_integer: true, greater_than_or_equal_to: 1}
    validate :after_start_date
    
    
    def after_start_date
      if end_date and end_date <= start_date
        errors.add(:end_date, "must be later than start date");
      end
    end
    
    
    #################
    # Object Methods
    #
    
    def missing_students
      missing = []
      User.where(:role=>"student").each do |student|
        if slots.where(:student_id=>student.id).count == 0
          missing << student
        end
      end
      return missing
    end
    
    def missing_submissions
      if has_submissions==false
        return []
      end
      missing = []
      User.where(:role=>"student").each do |student|
        if submissions.where(:user_id=>student.id).count == 0
          missing << student
        end
      end
      return missing
    end
    
    def remove_bad_slots
      #remove any slots that aren't within the dates of the event
      early_slots = slots.where("start_time < ?", start_date)
      late_slots  = slots.where("start_time > ?", end_date)
      if(early_slots.length>0 or late_slots.length>0)
        Rails.logger.warn("### removing #{early_slots.length} early slots and #{late_slots.length} late slots from event #{self.id}")
      end
      early_slots.destroy_all
      late_slots.destroy_all
    end
    #--- custom overrides ----
    def as_json(options)
       event = super(options) 
       event[:slots] = self.slots.as_json(options)
       unless options[:limited]
        event[:missing_students] = missing_students.as_json
        event[:missing_submissions] = missing_submissions.as_json
       end
      
       return event
    end
    
  end