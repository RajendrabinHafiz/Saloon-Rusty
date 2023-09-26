import React, { useEffect, useState } from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";
import { socket } from "../Socket";

import { useSelector, useDispatch } from "react-redux";

import { Chart } from "react-google-charts";


import { setDashboardData } from "../redux/ducks/admin";

const AdminRoute = (props) => {

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const dashboardData = useSelector((state) => state.admin.dashboardData);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (profile.rank < 9) return;

    socket.emit("admin:requestDashboard");

    socket.on("admin:dashboardResponse", (data) => {
      dispatch(setDashboardData(data))
      setLoaded(true);
    });


    return function cleanup() {
      socket.off("admin:dashboardResponse");
    }


  }, []);


  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      {profile.rank >= 9 && <div className="page-content" style={props.styles}>
        <div className="admin-dashboard">
          <h1>Dashboard</h1>

          <div class="boxes">

            {dashboardData.dailyStats.depositData.amounts.map((el, index) =>
              <React.Fragment>
                <div class="box">
                  <span class="value">${(el.totalAmount / 100).toFixed(2)}</span>
                  <span class="title">{el.type}</span>
                </div>
                {index !== dashboardData.dailyStats.depositData.amounts.length - 1 && <span>+</span>}
              </React.Fragment>
            )}
            <span>-</span>
            <div class="box">
              <span class="value" style={{ color: 'var(--red)' }}>${(dashboardData.dailyStats.totalWithdrawAmount / 100).toFixed(2)}</span>
              <span class="title">WITHDRAWS</span>
            </div>
            <span>=</span>
            <div class="box">
              <span class="value" style={{ color: dashboardData.dailyStats.netProfit > 0 ? 'var(--green)' : 'var(--red)' }}>${(dashboardData.dailyStats.netProfit / 100).toFixed(2)}</span>
              <span class="title">NET</span>
            </div>
          </div>

          <div class="boxes general-stats">

            <div class="box">
              <span class="value" style={{ color: dashboardData.generalStats.netProfitWeekly > 0 ? 'var(--green)' : 'var(--red)' }}  >${(dashboardData.generalStats.netProfitWeekly / 100).toFixed(2)}</span>
              <span class="title">Weekly Profit</span>
            </div>

            <div class="box">
              <span class="value" style={{ color: dashboardData.generalStats.netProfitMonthly > 0 ? 'var(--green)' : 'var(--red)' }}  >${(dashboardData.generalStats.netProfitMonthly / 100).toFixed(2)}</span>
              <span class="title">Monthly Profit</span>
            </div>

            <div class="box">
              <span class="value" style={{ color: dashboardData.generalStats.netProfitAllTime > 0 ? 'var(--green)' : 'var(--red)' }}  >${(dashboardData.generalStats.netProfitAllTime / 100).toFixed(2)}</span>
              <span class="title">All Profit</span>
            </div>

          </div>


          <div class="boxes general-stats">

            {dashboardData.newUsersData.map((el, index) =>
              <React.Fragment>
                <div class="box">
                  <span class="value" style={{color: 'orange'}}>{el.key}</span>
                  <span class="title">{el.count}</span>
                </div>
              
              </React.Fragment>
            )}
          </div>


          <div class="d-table">
            {dashboardData.dailyTable.map((el, index) =>
              <React.Fragment>
                <div>
                  <span >{el.day}</span>
                  <span style={{ color: el.profit > 0 ? 'var(--green)' : 'var(--red)' }}>${el.profit}</span>
                </div>

              </React.Fragment>
            )}
          </div>



          <div class="chart">

            <Chart
              width={'600px'}
              height={'400px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={dashboardData.monthlyChartData}
              options={{
                hAxis: {
                  title: 'Time',
                },
                vAxis: {
                  title: 'Profit',
                },
              }}
              rootProps={{ 'data-testid': '15' }}
            />


          </div>





        </div>
      </div>}
    </React.Fragment>
  );
};

export default AdminRoute;
