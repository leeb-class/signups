class Submission < ApplicationRecord

  #---Associations---
  belongs_to :user
  belongs_to :event
  has_one_attached :file
  
  #---Validations---
  validates :file, :presence=>true
  validate :submitted_before_deadline
  
  def submitted_before_deadline
    if event.submission_deadline<Time.now
      errors.add(:file, "must be submitted by deadline")
    end
  end
end
