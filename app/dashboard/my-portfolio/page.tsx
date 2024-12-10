import CreatePortfolio from "./create-form";

export default function PortfolioPage(){
    return(
        <div>
            Portfolio
            <div className="flex flex-row justify-center items-center">
                <CreatePortfolio />
            </div>
        </div>
    )
}