import Topbar from "../../components/Topbar";

const Home = (props: any) => {
  return (
    <div>
      <Topbar setActive={() => {}} tabs={new Map()} active />
    </div>
  );
};

Home.propTypes = {};

export default Home;
