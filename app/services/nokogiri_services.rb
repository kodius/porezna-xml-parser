class NokogiriServices
   def self.call(xml)
      @doc = Nokogiri::XML(xml, &:noblanks)
      @r_elements = @doc.search("R")
      arr = detach_racun_data(@r_elements)
      finish_xml_parsing(arr)
   end

   def self.detach_racun_data(data)
     arr = []
     data.map do |inf|
       hash = {}
       inf.children.map do |value|
        next if value.name === 'R3' && !Date.parsable?(value.children.to_s)

        hash.merge!(value.name => value.children.to_s) if value.class.name == 'Nokogiri::XML::Element'
       end
       arr << hash
     end
     ApplicationHelper.generete_data_for_parsed_file(arr)
   end

   def self.finish_xml_parsing(reduced_array)
     @doc.search('Racuni').remove
     @doc.at('Tijelo').prepend_child "<Racuni></Racuni>"
     reduced_array.sort_by { |hsh| hsh['R3']}.each_with_index do |h, index|
       string = "<R1>#{index + 1}</R1>" + h.map {|key,value| "<#{key}>#{value}</#{key}>" }.join('')
       @doc.at('Racuni').add_child "<R>#{string}</R>"
     end
     @doc
   end
end

class Date
  def self.parsable?(string)
    begin
      parse(string)
      true
    rescue ArgumentError
      false
    end
  end
end