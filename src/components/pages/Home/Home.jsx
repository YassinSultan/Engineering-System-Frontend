import Input from "../../ui/Input/Input";
import FileInput from "../../ui/FileInput/FileInput";
// import { AsyncPaginate } from "react-select-async-paginate";
export default function Home() {
  return (
    <>
      <div className="space-y-5">
        <div>
          <Input />
        </div>
        <div>
          <FileInput />
        </div>
        <div>
          {/* <Select
            isMulti
            placeholder="Search frameworks..."
            fetchOptions={fetchOptions}
            onCreateOption={handleCreateOption}
            allowCreate
            value={singleValue}
            onChange={(val) => setSingleValue(val)}
          /> */}
          {/* <AsyncPaginate
            value={value}
            loadOptions={loadOptions}
            onChange={onChange}
            isMulti={isMulti}
            debounceTimeout={400}
            additional={{ page: 1 }}
            placeholder="ابحث أو اختر..."
          /> */}
        </div>
      </div>
    </>
  );
}
