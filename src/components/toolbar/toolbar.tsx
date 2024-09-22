
const ToolBar: React.FC = () => {

    return (
       <>
       <div id ="toolbar-button">
        <button>
        <i className="fa-solid fa-clipboard-list" id="toolbar-button-icon"></i>
        <div>View Data 
        </div>
        </button>
        <button >
        <i className="fa-solid fa-gauge"></i>
        <div>Dashboard</div>
        </button>
        <button id="toolbar-button">
        <i className="fa-solid fa-binoculars"></i>
        <div>Scouting</div>
        </button>
       </div>
       </>
    );
 }
 
 export default ToolBar;