class SlotsController < ApplicationController
    before_action :authenticate_user!
  
    # GET /events/1/slots
    def index
      slots = Slot.all
      render json: slots 
    end
  
    # GET /events/1/slots/1
    def show
      @slots = Slots.find(params[:id])
  
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @slot }
      end
    end
  
    # GET /events/1/slots/new
    def new
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      @slot = Slot.new
  
      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @slot }
      end
    end
  
    # GET /events/1/slots/1/edit
    def edit
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      @slot = Slot.find(params[:id])
    end
  
    # POST /events/1/slots
    def create
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      event = Event.find(params[:event_id])
      
      #add slots for the number of students allowed per slot 
      (1..event.students_per_slot).each do |i|
        @slot = Slot.new(slot_params)
        if(current_user.admin?) #admins can assign slots to admins and other TAs
          ta = User.find(params[:ta][:id])
          raise "Illegal TA #{user}" unless ((ta.role == "admin") or (ta.role == "ta"))
          @slot.ta = ta
        else
          @slot.ta = current_user;
        end
        @slot.event = event
        break unless @slot.valid?
        @slot.save!
      end
      respond_to do |format|
        if @slot.valid?
          format.html { redirect_to @slot, notice: 'Slot was successfully created.' }
          format.json { render json: @slot, status: :created }
        else
          format.html { render action: "new" }
          format.json { render json: @slot.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # PUT /events/1/slots/1
    def update
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      @slot = Slot.find(params[:id])
      if current_user.ta? and @slot.ta!=current_user
        head :unauthorized
        return
      end
      #admins can assign students to slots
      if(params[:student] and current_user.admin?)
        @slot.student = User.find(params[:student][:id])  
      end
      
      respond_to do |format|
        if @slot.update(slot_params)
          format.html { redirect_to @slot, notice: 'Slot was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { render action: "edit" }
          format.json { render json: @slot.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # PUT /events/1/slots/1/signup
    def signup
      @event = Event.active.find(params[:event_id])
      @slot = @event.slots.find(params[:id])
      #students get the first available slot at the requested time
      #this prevents "gaming" the system to pick a TA
      if current_user.student?
        @slot = @event.slots.where(:start_time=>@slot.start_time, :student_id=>nil).first
      end
      
      #check if this is a permissable action (default = deny)
      allowed = false
      
      #allow students to signup for slots that 
      #are empty and haven't happened yet as
      #long as they haven't already signed up for a
      #slot for this event
      if current_user.student?
        if(@slot.start_time>Time.now) and (@slot.student==nil)
          if Slot.where(:student_id=>current_user.id,:event_id=>@event.id).count == 0 
            allowed=true
          end
        end
      end
      
      if not allowed
        head :unauthorized
        return
      end
      
      @slot.student = current_user
      @slot.save!
      head :no_content
      return
    end
    
    # PUT /events/1/slots/1/remove_signup
    def remove_signup
      
      @event = nil
      #admins can move users between slots even if they are not active events
      if current_user.admin?
        @event = Event.find(params[:event_id])
      else
      #TAs and students can only remove signups for active events
        @event = Event.active.find(params[:event_id])
      end
      @slot = @event.slots.find(params[:id])
      
      allowed = false
      #allow students to remove themselves from a slot as long
      #as the slot hasn't already happened
      if current_user.student? 
        if (@slot.start_time > Time.now) and (@slot.student == current_user)
          allowed = true
        end
      end
      #allow admins to remove anybody from a slot
      if current_user.admin? and (@slot.student!= nil)
        allowed = true
      end
    
      if not allowed
        head :unauthorized
        return
      end
      
      
      @slot.student = nil
      @slot.save!
      head :no_content
      return
    end
    
    # DELETE /events/1/slots/1
    # DELETE /events/1/slots/1.json
    def destroy
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      @slot = Slot.find(params[:id])
      if current_user.ta? and @slot.ta!=current_user
        head :unauthorized
        return
      end
      
      @slot.destroy
      head :no_content
    end

    def slot_params
        params.require(:slot).permit(:location, :start_time)
    end
  end