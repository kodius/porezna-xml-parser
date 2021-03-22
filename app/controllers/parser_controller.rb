class ParserController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index; end

  def upload
    sleep 5
    read_xml = params[:fileUpload].read
    doc = NokogiriServices.call(read_xml)
    headers['Content-Type'] = "application/octet-stream"
    send_data(
      doc.to_xml,
      filename: filename,
      type: "text/xml",
    )
  end

  private

  def filename
    "#{params[:fileUpload].original_filename.sub(/\.[^.]+\z/, "")}_kodius.xml"
  end
end
