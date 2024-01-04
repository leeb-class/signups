class EventsController < ApplicationController
    before_action :authenticate_user!
  
    # GET /events
    def index
      options = {}
      if not (current_user.ta? or current_user.admin?)
        options[:limited]=true
        options[:student]=current_user
        @events = Event.active.all
      else
        @events = Event.all
      end
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @events.as_json(options) }
      end
    end
  
    # GET /events/1
    def show
      options = {}
      if not (current_user.ta? or current_user.admin?)
        options[:limited]=true
        options[:student]=current_user
      end
      @event = Event.find(params[:id])
  
      respond_to do |format|
        format.html { 
          unless current_user.ta? or current_user.admin?
            head :unauthorized
            return
           end
           # show.html.erb
         }
        format.json { render json: @event.as_json(options) }
      end
    end
  
    # GET /events/1/signup
    def signup
      @event = Event.active.find(params[:id])
      if @event.has_submissions
        @submission = Submission.where(:user_id=>current_user.id, :event_id=>@event.id).first
        unless @submission
          @submission = Submission.new
        end
        @submission.event = @event
      end
    end
    
    # GET /events/new
    def new
      unless current_user.admin?
        head :unauthorized
        return
      end
      
      @event = Event.new
  
      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @event }
      end
    end
  
    # GET /events/1/edit
    def edit
      unless current_user.admin?
        head :unauthorized
        return
      end
      @event = Event.find(params[:id])
    end
  
    # POST /events
    # POST /events.json
    def create
      unless current_user.admin?
        head :unauthorized
        return
      end
      @event = Event.new(event_params)
  
      respond_to do |format|
        if @event.save
          format.html { redirect_to @event, notice: 'Event was successfully created.' }
          format.json { render json: @event, status: :created, location: @event }
        else
          format.html { render action: "new" }
          format.json { render json: @event.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # PUT /events/1
    # PUT /events/1.json
    def update
      unless current_user.admin?
        head :unauthorized
        return
      end
      @event = Event.find(params[:id])
     
      respond_to do |format|
        if @event.update(event_params)
          #remove any slots that aren't within the bounds of the event dates
          @event.remove_bad_slots
          format.html { redirect_to @event, notice: 'Event was successfully updated.' }
          format.json { head :no_content,  notice: 'Event was successfully updated.' }
        else
          format.html { render action: "edit" }
          format.json { render json: @event.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # DELETE /events/1
    # DELETE /events/1.json
    def destroy
      unless current_user.admin?
        head :unauthorized
        return
      end
      event = Event.find(params[:id])
      event.destroy
      head :no_content
    end
    
    # GET /events/1/submissions
    def submissions
      unless current_user.admin? or current_user.ta?
        head :unauthorized
        return
      end
      @event = Event.find(params[:id])
      unless @event.has_submissions
        head :unprocessable_entity
        return
      end
    end


    def event_params
        # :email, :password, :password_confirmation, :remember_me, :first_name, :last_name, :username, :role
        params.require(:event).permit(:start_date, :end_date, :black_out_times, :name, :slot_length, :visible,
                       :students_per_slot, :has_submissions, :submission_deadline)
    end
  end