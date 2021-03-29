class ParserController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index; end

  def upload
    read_xml = params[:file]['0'].read
    doc = NokogiriServices.call(read_xml)
    file_path = "#{Rails.root}/tmp/" + filename
    @file = File.open(file_path, "w") { |f| f.write(doc.to_xml) }
    respond_to do |format|
      format.json {render json: { filename: filename } }
    end
  end

  def download
    send_file(
      "#{Rails.root}/tmp/#{params[:filename]}",
      filename: params[:filename],
      type: "text/xml"
    )
  end

  private

  def filename
    "#{params[:file]['0'].original_filename.sub(/\.[^.]+\z/, "")}_kodius.xml"
  end
end
