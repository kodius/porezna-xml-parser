Rails.application.routes.draw do
  root 'parser#index'

  post '/upload-xml' => 'parser#upload'
  get '/download-xml' => 'parser#download'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
