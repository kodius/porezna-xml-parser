class NokogiriServices
   def self.call(xml)
      @doc = Nokogiri::XML(xml, &:noblanks)
      @r_elements = @doc.search("R")
      arr = detach_racun_data(@r_elements)
      finish_xml_parsing(arr)
   end

   def self.detach_racun_data(data)
     arr = []
     data.map do |k|
       h = {}
       k.children.map do |v|
         h.merge!(v.name => v.children.to_s) if v.class.name == 'Nokogiri::XML::Element'
       end
       arr << h
     end
     ApplicationHelper.generete_data_for_parsed_file(arr)
   end

   def self.finish_xml_parsing(reduced_array)
     @doc.search('Racuni').remove
     @doc.at('Tijelo').prepend_child "<Racuni></Racuni>"
     reduced_array.each_with_index do |h, index|
       string = "<R1>#{index + 1}</R1>" + h.map {|key,value| "<#{key}>#{value}</#{key}>" }.join('')
       @doc.at('Racuni').add_child "<R>#{string}</R>"
     end
     @doc
   end
end
