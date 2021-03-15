Rails.application.routes.draw do
  root 'xml_parsers#index'

  post '/upload-xml' => 'xml_parsers#upload'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
