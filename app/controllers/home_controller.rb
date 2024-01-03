class HomeController < ApplicationController
    before_action :authenticate_user!

    def index 
        if current_user.admin?
            redirect_to admin_index_path
            return
        end
        if current_user.ta?
            redirect_to events_path
            return
        end
        @events = Event.active.all
        if(@events.length==1)
            @event = @events.first
            if @event.has_submissions
            @submission = Submission.where(:user_id=>current_user.id, :event_id=>@event.id).first
            unless @submission
                @submission = Submission.new
            end
            @submission.event = @event
            end
            render "events/signup"
            return
        elsif(@events.length>1)
            render "events/index"
            return
        end
    end

    def admin_index
        redirect_to root_path unless current_user.admin?
    end

    def ta_index
        redirect_to root_path unless current_user.ta?
    end
end
