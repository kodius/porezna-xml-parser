module ApplicationHelper
  ELEMENTS_TO_COMPUTE = %w(R8 R9 R10 R11 R12 R13 R14 R15 R16 R17 R18)

  class << self
    def generete_data_for_parsed_file(arr)
      remove_id_from_xml(arr)
      grouped_data(arr).map do |a|
        a.flatten.reduce do |acc,h|
          acc.merge(h) do |key, v1, v2|
            ELEMENTS_TO_COMPUTE.include?(key) ? transform_string_to_money_and_sum(v1, v2) : v2
          end
        end
      end
    end

    def remove_id_from_xml(arr)
      arr.each { |h| h.delete('R1') }
    end

    def grouped_data(input)
      input.group_by {|g| [g["R2"], g["R3"], g["R7"]] }.values
    end

    def transform_string_to_money_and_sum(total1, total2)
      sum_money =  Monetize.parse(total1) + Monetize.parse(total2)
      sum_money.to_money.format(symbol:nil, thousands_separator: '')
    end
  end
end
