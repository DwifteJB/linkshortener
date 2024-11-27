import BackgroundCanvas from "../components/backgroundCanvas"

const MainPage = () => {
    return (
        <BackgroundCanvas> 
            <div className="w-screen h-screen bg-black/50">
                <div className="p-4 text-white">
                    <div className="w-full flex justify-center items-center pt-4">
                        <img src="/rmshortify.png" className="w-full max-w-[556px] h-auto" />
                    </div>
                </div>
            </div>


        </BackgroundCanvas>
    );
}

export default MainPage;