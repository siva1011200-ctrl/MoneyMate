import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageAnimation from "../components/PageAnimation";


function MainLayout({children}){

return(

<div className="flex min-h-screen bg-gray-100">


<Sidebar/>


<div className="flex-1 flex flex-col">


<Navbar/>


<main className="p-6 flex-1">

<PageAnimation>

{children}

</PageAnimation>

</main>


<Footer/>


</div>


</div>

)

}


export default MainLayout;