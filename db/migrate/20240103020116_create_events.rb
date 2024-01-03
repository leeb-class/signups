class CreateEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.string :black_out_times
      t.string :name
      t.datetime :start_date
      t.datetime :end_date
      t.integer :slot_length
      t.boolean :visible
      t.integer :students_per_slot
      t.boolean :has_submissions
      t.datetime :submission_deadline

      t.timestamps
    end
  end
end
