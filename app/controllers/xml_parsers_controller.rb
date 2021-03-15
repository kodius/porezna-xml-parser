class XmlParsersController < ActionController::Base
  def index; end

  def upload
    read_xml = params[:file].read
    doc = NokogiriServices.call(read_xml)
    send_data(
      doc.to_xml,
      filename: filename,
      type: "text/xml"
    )
  end

  private

  def filename
    "#{params[:file].original_filename.sub(/\.[^.]+\z/, '')}_kodius.xml"
  end
end
