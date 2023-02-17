# frozen_string_literal: true

class NokogiriServices
  def self.call(xml)
    @doc = Nokogiri::XML(xml, &:noblanks)
    @r_elements = @doc.search('R')
    @obrazac = @doc.search('ObrazacURA')
    root = @doc.root
    @doc.remove_namespaces!
    root['xmlns'] = 'http://e-porezna.porezna-uprava.hr/sheme/zahtjevi/ObrazacURA/v2-0'
    root['xmlns:meta'] = 'http://e-porezna.porezna-uprava.hr/sheme/Metapodaci/v2-0'
    root['xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance'
    @obrazac[0].attributes['verzijaSheme'].value = '2.0'
    root['xsi:schemaLocation'] = 'http://e-porezna.porezna-uprava.hr/sheme/zahtjevi/ObrazacURA/v2-0 ObrazacURA-v2-0.xsd'
    @doc.root.remove_attribute('schemaLocation')
    arr = detach_racun_data(@r_elements)
    finish_xml_parsing(arr)
  end

  def self.detach_racun_data(data)
    arr = []
    data.map do |inf|
      hash = {}
      inf.children.map do |value|
        next if value.name === 'R3' && !Date.parsable?(value.children.to_s)

        hash.merge!(value.name => value.children.to_s) if value.instance_of?(::Nokogiri::XML::Element)
      end
      arr << hash
    end
    ApplicationHelper.generete_data_for_parsed_file(arr)
  end

  def self.finish_xml_parsing(reduced_array)
    @doc.search('Racuni').remove
    @doc.at('Tijelo').prepend_child '<Racuni></Racuni>'
    reduced_array.sort_by { |hsh| hsh['R3'] }.each_with_index do |h, index|
      mapa = h.to_a
      mapa.insert(6, ['R19', '0.00'])
      sortirano = mapa.to_h
      string = "<R1>#{index + 1}</R1>" + sortirano.map { |key, value| "<#{key}>#{value}</#{key}>" }.join('')
      @doc.at('Racuni').add_child "<R>#{string}</R>"
    end
    @doc.at('Ukupno').prepend_child '<U19>0.00</U19>'
    @doc
  end
end

class Date
  def self.parsable?(string)
    parse(string)
    true
  rescue ArgumentError
    false
  end
end
