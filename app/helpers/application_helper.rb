module ApplicationHelper
  class << self
    def reduce_same_keys(arr)
      remove_id_from_xml(arr)
      grouping_data_from_file(arr).each_with_index.map do |a, index|
        a.flatten.reduce do |acc,h|
          acc.merge(h) do |key, v1, v2|
            keys_to_reduce.include?(key) ? v1.to_f + v2.to_f : v2
          end
        end
      end
    end

    def keys_to_reduce
      %w(R8 R9 R10 R11 R12 R13 R14 R15 R16 R17 R18)
    end

    def remove_id_from_xml(arr)
      arr.each { |h| h.delete('R1') }
    end

    def grouping_data_from_file(arr)
      arr.group_by {|g| [g["R2"], g["R3"], g["R7"]] }.values
    end
  end
end
