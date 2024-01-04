class CreateSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table :submissions do |t|
      t.text :text
      t.boolean :on_time
      t.integer :event_id
      t.integer :user_id
      t.boolean :locked

      t.timestamps
    end
  end
end
