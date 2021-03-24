class ParserController < ApplicationController
  def index; end

  def upload
    byebug
    read_xml = params[:file].read
    doc = NokogiriServices.call(read_xml)
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
