class UsersController < ApplicationController
    before_action :authenticate_user!
  
    # GET /users
    def index
      unless current_user.admin?
        head :unauthorized
        return
      end
      @users = []
      if(params[:type]=="ta_or_admin")
        @users = User.where(:role=>["admin","ta"])
      elsif(params[:type]=="student")
        @users = User.where(:role=>["student"])      
      else
        @users = User.all
      end
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @users }
      end
    end
  
    # GET /users/1
    # GET /users/1.json
    def show
      unless current_user.admin?
        head :unauthorized
        return
      end
      
      @user = User.find(params[:id])
  
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @user }
      end
    end
  
    # GET /users/new
    # GET /users/new.json
    def new
      unless current_user.admin?
        head :unauthorized
        return
      end
      
      @user = User.new
  
      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @user }
      end
    end
  
    # GET /users/bulk
    def bulk
      unless current_user.admin?
        head :unauthorized
        return
      end
    end
    
    # POST /users/bulk_add.json
    def bulk_add
      #only admins can do this
      unless current_user.admin? 
        render nothing: true, status: :unauthorized and return
      end
      params[:students].each do |student_params|
        student = User.new(student_params.permit(:first_name, :last_name, :email, :username, :password))
        student.role = 'student'
        unless student.save
          puts "------------------"
          puts student.errors.full_messages
          render json: User.where(:role=>["student"]), status: :unprocessable_entity and return
        end
      end
      render json: User.where(:role=>["student"])
    end
  
    # POST /users/do_bulk_remove.json
    def bulk_remove
      #only admins can do this
      unless current_user.admin? 
        render nothing: true, status: :unauthorized and return
      end
      params[:students].each do |student_params|
        student = User.find_by_username(student_params[:username])
        unless student
          render json: User.where(:role=>["student"]), status: :unprocessable_entity and return
        end
        student.destroy
      end
      render json: User.where(:role=>["student"])
    end
    
    
    # GET /users/1/edit
    def edit
      unless ((current_user.admin?) or (current_user.id==params[:id].to_i))
        head :unauthorized
        return
      end
      @user = User.find(params[:id])
    end
  
    # POST /users
    # POST /users.json
    def create
      unless current_user.admin?
        head :unauthorized
        return
      end
      
      @user = User.new(user_params)
      @user.role = params[:user][:role]
      respond_to do |format|
        if @user.save
          format.html { redirect_to users_path, notice: 'User was successfully created.' }
          format.json { render json: @user, status: :created, location: @user }
        else
          format.html { render action: "new" }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # PUT /users/1
    # PUT /users/1.json
    def update
      unless current_user.admin? or current_user.id==params[:id].to_i
        head :unauthorized
        return
      end
      
      @user = User.find(params[:id])
      #don't change the password unless a new one is set
      new_params = user_params
      if new_params[:password].blank? && new_params[:password_confirmation].blank?
        new_params.delete(:password)
        new_params.delete(:password_confirmation)
      end
      #only admins can change user roles and no one can change their own role
      if current_user.admin? and current_user.id!=params[:id]
        @user.role = params[:user][:role]
      end
      respond_to do |format|
        if @user.valid? and @user.update(new_params)
          format.html { 
            if current_user.admin?
              redirect_to users_path, notice: 'User was successfully updated.'
            else
              redirect_to root_path, notice: "Account successfully updated"
             end
           }
          format.json { head :no_content }
        else
          format.html { render action: "edit" }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  
    # DELETE /users/1
    # DELETE /users/1.json
    def destroy
      unless current_user.admin?
        head :unauthorized
        return
      end
      
      user = User.find(params[:id])
      user.destroy
      head :no_content
    end

    def user_params
        # :email, :password, :password_confirmation, :remember_me, :first_name, :last_name, :username, :role
        params.require(:user).permit(:first_name, :last_name, :email, :username, :password, :password_confirmation)
    end
  end
  