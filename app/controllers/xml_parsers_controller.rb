class XmlParsersController < ActionController::Base
  def index; end

  def upload
    uploaded_io = params[:file]
    read_xml = uploaded_io.read
    # path = 'XmlTest_10.03.21_07_25.xml'
    # file_path = "#{Rails.root}/tmp/" + path
    # File.open(file_path, "w") { |f| f.write(uploaded_io.read.to_s.encode('ISO-8859-15', invalid: :replace, undef: :replace, replace: '')) }
    doc = Nokogiri::XML(read_xml)
    doc.search('Tijelo').remove
    doc2 = Nokogiri::XML(read_xml)
    doc2.remove_namespaces!
    kita = doc2.search("R")
    arr = []
    vrom = kita.map do |k|
      h = {}
      k.children.map do |v|
        h.merge!(v.name => v.children.to_s) if v.class.name == 'Nokogiri::XML::Element'
      end
      arr << h
    end
    byebug
    File.open("#{Rails.root}/tmp/metapodaci.xml", "w") { |f| f.write(doc.to_xml.encode('ISO-8859-15', invalid: :replace, undef: :replace, replace: '')) }
  end
end