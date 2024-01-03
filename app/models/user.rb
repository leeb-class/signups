class User < ApplicationRecord

  #---Associations---
  has_many :slots
  has_many :submissions, dependent: :destroy
  
  #---Attributes---
  #attr_accessible :email, :password, :password_confirmation, :remember_me, :first_name, :last_name, :username, :role
 
  
  #---Validations---
  before_validation :init_defaults

  validates :username, :uniqueness=>true
  validates :email, :uniqueness=>true
  validates :first_name, :last_name, :presence=>true
  validates :role, inclusion: {in: %w(ta student admin)}

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable

  #################
  # Object methods
  #
  def init_defaults
    if self.email.blank?
      self.email = self.username+"@mit.edu"
    end
  end
  
  def admin?
    self.role=="admin"
  end
  
  def ta?
    self.role=="ta"
  end
  
  def student?
    self.role=="student"
  end
  
  def full_name
    self.first_name+" "+self.last_name
  end
  

end
