import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../components/desktop/LeftSidebar";
import Footer from "../components/Footer";

export const SearchRoute = () => {
  const { mobile } = useSelector((state) => state.main);
  const [inputSearch, setInputSearch] = useState(null);
  const navigate = useNavigate();

  let inputRef = useRef(null);

  useEffect(() => {
    let value = inputRef.current?.value;

    if (value && !inputSearch && value.length > 0) {
      inputRef.current.value = "";
    }
  }, [inputSearch]);

  useEffect(() => {
    !mobile && navigate("/");
  }, [mobile, navigate]);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <div id="search-route">
          <div className="title">SEARCH FOR GAMES</div>
          <div className="input">
            <input
              type="text"
              placeholder="Search for games"
              ref={inputRef}
              onChange={(e) =>
                setInputSearch(
                  !e.target.value || e.target.value.length === 0x0
                    ? null
                    : e.target.value,
                )
              }
            />
            <img src="/images/new_form/search.svg" alt="" />
          </div>
          <div className="hr"></div>
          <div className="buttons">
            {menuItems[0].routes.map(
              (item, index) =>
                (inputSearch === null ||
                  item.label
                    .toLowerCase()
                    .indexOf(inputSearch.toLowerCase() ?? "") > -1) && (
                  <div
                    className="item"
                    key={index}
                    onClick={() => navigate(`/${item.link}`)}
                  >
                    <img
                      draggable="false"
                      src={`/images/${item.icon}.svg`}
                      alt=""
                    />
                    <span>{item.label}</span>
                  </div>
                ),
            )}
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};


export default SearchRoute;