class SubmissionsController < ApplicationController
    # GET /submissions
    # GET /submissions.json
    def index
      @event = Event.find(params[:event_id])
      unless @event.has_submissions
        head :unprocessable_entity
        return
      end
      @submission = @event.submissions.where(:user_id=>current_user.id).first;
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @submission }
      end
    end
  
    # GET /submissions/1
    # GET /submissions/1.json
    def show
      #find by event_id
      @event = Event.find(params[:event_id])
      unless @event.has_submissions
        head :unprocessable_entity
        return
      end
      @submission = @event.submissions.where(:user_id=>current_user.id).first;
      
      unless @submission 
        head :unprocessable_entity
        return
      end
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @submission }
      end
    end
  
  
    # POST /submissions
    # POST /submissions.json
    def create
      @submission = Submission.new(submission_params)
      @submission.user = current_user
      respond_to do |format|
        if @submission.save
          format.html { redirect_to signup_event_path(@submission.event),
                       notice: 'Submission was successfully uploaded.' }
          format.json { render json: @submission, status: :created, location: @submission }
        else
          format.html { redirect_to signup_event_path(@submission.event),
                        alert: 'Specify file to upload' }
          format.json { render json: @submission.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # DELETE /submissions/1
    # DELETE /submissions/1.json
    def destroy
      @submission = Submission.find(params[:id])
      @submission.destroy
  
      respond_to do |format|
        format.html { redirect_to submissions_url }
        format.json { head :no_content }
      end
    end

    def submission_params
        params.require(:submission).permit(:file, :event_id)
    end
  end
  