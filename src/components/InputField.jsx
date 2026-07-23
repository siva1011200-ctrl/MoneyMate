function InputField({
label,
type="text",
placeholder
}){

return(

<div className="mb-4">

<label className="block mb-2 font-medium">
{label}
</label>


<input

type={type}

placeholder={placeholder}

className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>

)

}

export default InputField;