import CreatePortfolio from "./form/create-portfolio";

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