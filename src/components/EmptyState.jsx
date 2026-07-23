function EmptyState({message}){

return(

<div className="
text-center
p-10
glass
rounded-2xl
">

<div className="
text-5xl
mb-4
">
📂
</div>


<h2 className="
text-xl
font-bold
">

No Data Found

</h2>


<p className="
text-gray-500
mt-2
">

{message}

</p>


</div>

)

}


export default EmptyState;