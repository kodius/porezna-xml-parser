class ParserController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index; end

  def upload
    read_xml = params[:file]['0'].read
    doc = NokogiriServices.call(read_xml)
    # file_path = "#{Rails.root}/tmp/" + filename
    # @file = File.open(file_path, "w") { |f| f.write(doc.to_xml) }
    send_data(
      doc.to_xml,
      filename: 'kita',
      disposition: 'attachment'
    )
  end

  def download
    send_file(
      "#{Rails.root}/tmp/asasa_kodis.xml",
      filename: 'kita',
      type: "text/xml"
    )
  end

  private

  def filename
    "#{params[:file]['0'].original_filename.sub(/\.[^.]+\z/, "")}_kodius.xml"
  end
end
