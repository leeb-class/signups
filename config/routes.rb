Rails.application.routes.draw do
 
  resources :submissions


  root :to => 'home#index'
  get '/admin', to: 'home#admin_index', as: :admin_index
  get '/ta', to: 'home#ta_index', as: :ta_index
  
  devise_for :users, :path=>"auth", :controllers=>{:registrations => :users}
  devise_scope :user do
    resources :users do
      collection do
        post 'bulk_add', as: :bulk_add
        post 'bulk_remove'
        get 'bulk'
      end
    end
  end
  resources :events do
    member do
      get 'signup'
      get 'submissions'
    end
    resources :slots do
      member do
        put 'signup'
        put 'remove_signup'
      end
    end
  end
end
