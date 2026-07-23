function Button({children}){

return(
<button
className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-semibold
hover:bg-blue-700
transition
"
>
{children}
</button>
)

}

export default Button;