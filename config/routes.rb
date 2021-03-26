Rails.application.routes.draw do
  root 'parser#index'

  post '/upload-xml' => 'parser#upload'
  get '/download-xml' => 'download#upload'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
