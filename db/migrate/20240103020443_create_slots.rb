class CreateSlots < ActiveRecord::Migration[7.1]
  def change
    create_table :slots do |t|
      t.datetime :start_time
      t.integer :ta_id
      t.integer :student_id
      t.integer :event_id
      t.boolean :locked
      t.string :location

      t.timestamps
    end
  end
end
