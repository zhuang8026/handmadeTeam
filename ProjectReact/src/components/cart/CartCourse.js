import React, { useContext } from "react";
import { FaRegClock } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { AiOutlineBook } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { cancelCourse } from './CartAction';
import CartStore from './CartStore'

const CartCourse = ({ courseName, courseOrderApplicants, courseOrderChoose, courseList, courseSid }) => {
  
  const { courseCart, id, cartCourseDispatch } = useContext(CartStore);
  const courseSelect = (courseSid,courseOrderChoose) => {
    let courseSelectCheck = courseCart.filter((courseC) => {
      return courseC.course_sid == courseSid && courseC.course_order_choose == courseOrderChoose
    })
    cartCourseDispatch(cancelCourse(courseSelectCheck[0], id))
  }

  return (
    <>
      <ul className="d-flex justify-content-around align-items-center px-4 course_sm_cart mb-0">
        <div className='cancel_sm_cart'>
          <MdCancel style={{ cursor: 'pointer',color:'white'}} onClick={() => courseSelect(courseSid,courseOrderChoose)} />
        </div>
        <li className="d-flex flex-column align-items-between py-3" style={{lineHeight:'30px'}}>
          <div className="product-title" style={{fontSize:'20px'}}>{courseOrderChoose ? courseOrderChoose.split(" ")[0] : ''}</div>
          <div className="d-flex align-items-center" style={{fontSize:'14px'}}>
            <AiOutlineBook className="cartList_icons" />
            {courseName}
          </div>
          <div className="d-flex align-items-center">
            <FaRegClock className="cartList_icons" />
            {courseOrderChoose ? courseOrderChoose.split(" ")[1] : ''}
          </div>
          <div className="d-flex align-items-center">
            <GoPerson className="cartList_icons" />
            {courseOrderApplicants}
          </div>
        </li>
        <figure style={{
          height:"100%",
          width:'40%'
        }}
        className='mb-0'
        >
          <img
            src={"/image/course_img/360/" + courseList}
            alt=""
            width="100%"
            height="100%"
          />
        </figure>
      </ul>
    </>
  );
};

export default CartCourse;
