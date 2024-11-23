
import React from "react";
import { FooterStyled, FooterTextStyled } from "./style";
import imgfb from "../../assets/images/fb.jpg"
import imgins from "../../assets/images/ins.jpg"
import imgtiktok from "../../assets/images/tiktok.jpg"
const Footer = () => {
    return (
        <footer >
            <FooterStyled style={{ paddingLeft: '2%' }}  >
                <FooterTextStyled md={10} sm={8} xs={8}>
                    <h2>LIÊN HỆ</h2>
                    <h4>&#x1F4CC;127/14,Hoàng Hoa Thám,P13,Quận Tân Bình,TP HCM</h4>
                    <h4>&#9742;Phone: 039 570 4727</h4>
                    <h4>&#9993;Email: phoangphat313@gmail.com</h4>
                </FooterTextStyled>
                <FooterTextStyled span={8} sm={8} xs={8} >
                    <h2>CHÍNH SÁCH HỖ TRỢ</h2>
                    <h4>Tìm kiếm</h4>
                    <h4>Giới thiệu</h4>
                    <h4>Chính sách thanh toán</h4>
                    <h4>Chính sách hỗ trợ</h4>
                    <h4>Chính sách đổi trả và hoàn tiền</h4>
                </FooterTextStyled>
                <FooterTextStyled span={6} sm={8} xs={8}>
                    <h2>LIÊN KẾT VỚI CHÚNG TÔI</h2>
                    <h4>Hãy kết nối với chúng tôi</h4>
                    <div class="footer_icon">
                        <a href="https://www.facebook.com/hphat.031"><img alt="img-fb" src={imgfb} style={{ height: '30px', width: '30px' }} /></a>
                        <a href="https://www.instagram.com/if.hphat/"><img alt="img-ins" src={imgins} style={{ height: '30px', width: '30px' }} /></a>
                        <img alt="ims-tiktok" src={imgtiktok} style={{ height: '30px', width: '30px' }} />
                    </div>
                </FooterTextStyled>
            </FooterStyled>
        </footer>
    )
}

export default Footer;

