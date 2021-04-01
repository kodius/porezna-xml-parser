class ParserController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index; end

  def upload
    read_xml = params[:file]['0'].read
    if ura_xml_format?(read_xml)
      doc = NokogiriServices.call(read_xml)
      file_path = "#{Rails.root}/tmp/" + filename
      @file = File.open(file_path, "w") { |f| f.write(doc.to_xml) }
      respond_to do |format|
        format.json {render json: { filename: filename, status: 200 } }
      end
    else
      respond_to do |format|
        format.json {render json: { filename: filename, status: 400 } }
      end
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

  def ura_xml_format?(xml)
    doc = Nokogiri::XML(xml, &:noblanks)
    doc.search('Racuni').search('R').search('R1', 'R2', 'R7').present?
  end
end
