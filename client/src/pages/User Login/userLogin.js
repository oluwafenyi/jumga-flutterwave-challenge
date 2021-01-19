import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {AltNavigation} from '../../components/Navigation/navigation';
import Footer from '../../components/Footer/footer';
import { jumga } from "../../axios";
import { jumgaState, notification } from "../../store/store";
import './userLogin.scss';


const UserLogin = () => {
    const [ form, updateForm ] = useState({ "email": "", "password": "" });
    const history = useHistory();

    useEffect(() => {
        if (!notification.displayed() && notification.location === "login") {
            notification.display();
        }
    }, [])

    const handleFormChange = (e) => {
        updateForm(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await jumga.post("/auth/token", form);
            console.log(response.data);
            jumgaState.setAccessToken(response.data.access_token);
            const profileResponse = await jumga.get("/auth/user");
            const { name, email, country, address, mobile } = profileResponse.data.data;
            jumgaState.setUserData({ name, email, country, address, mobile })
            history.push("/");
        } catch (err) {
            notification.setValues({ status: "failed", message: "Invalid login credentials", location: "login" })
            console.log(err);
            notification.display();
        }
    }

    return(
        <div className="user-login-page">
          <nav>
                <AltNavigation/>
            </nav>
            <main>
                <ToastContainer/>
                <div className="user-login-img">
                    <svg width="610" height="441" viewBox="0 0 610 441" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                        <path d="M27.0525 428.229C46.0661 441.02 70.7064 441.662 94.5239 440.091C97.8497 439.872 101.152 439.614 104.424 439.337C104.443 439.332 104.469 439.334 104.489 439.329C104.647 439.315 104.804 439.301 104.955 439.293C105.63 439.234 106.306 439.175 106.974 439.116L106.816 439.397L106.32 440.271C106.499 439.978 106.677 439.692 106.855 439.4C106.907 439.312 106.966 439.225 107.018 439.137C113.188 429.111 119.308 418.716 120.869 407.268C122.482 395.384 117.948 381.929 106.748 376.088C105.279 375.324 103.723 374.716 102.11 374.274C101.44 374.084 100.761 373.93 100.075 373.793C95.8742 372.922 91.501 373.112 87.4049 374.342C83.3088 375.573 79.6375 377.8 76.7687 380.794C73.8998 383.789 71.9369 387.443 71.0817 391.381C70.2265 395.318 70.5099 399.398 71.9028 403.199C62.4071 394.107 64.1785 379.357 67.454 367.03C70.7359 354.703 74.709 340.986 68.0339 329.914C64.3233 323.751 57.7981 319.927 50.4752 318.387C50.2505 318.341 50.0262 318.296 49.8011 318.257C41.076 316.607 32.0055 318.091 24.4011 322.413C10.399 330.652 3.20742 346.274 0.873321 361.577C-2.88734 386.203 5.43506 413.686 27.0525 428.229Z" fill="#F2F2F2"/>
                        <path d="M33.1914 388.754C33.7434 394.186 35.1407 399.513 37.3393 404.569C39.3654 409.042 42.0965 413.208 45.4418 416.927C52.2755 424.603 61.3116 430.374 71.125 434.22C78.6286 437.09 86.4905 439.062 94.5239 440.091C97.8497 439.872 101.152 439.614 104.424 439.337C104.443 439.332 104.469 439.334 104.489 439.329C104.647 439.315 104.804 439.301 104.955 439.293C105.63 439.234 106.305 439.175 106.974 439.116L106.816 439.397L106.32 440.271C106.499 439.978 106.677 439.692 106.855 439.4C106.907 439.312 106.966 439.225 107.018 439.137C100.996 433.534 96.4991 426.664 93.9053 419.104C91.3114 411.544 90.6958 403.513 92.1102 395.685C93.5903 387.912 97.0166 380.576 102.11 374.274C101.44 374.084 100.761 373.93 100.075 373.793C98.1389 376.265 96.441 378.891 95.0007 381.641C89.8325 391.45 88.1837 402.552 90.2983 413.303C92.2642 423.033 97.162 432.037 104.417 439.258C103.781 439.216 103.14 439.167 102.512 439.114C90.6233 438.173 78.7586 435.787 67.9751 430.898C58.7577 426.821 50.7554 420.689 44.6731 413.044C38.1422 404.634 35.2645 394.517 34.7701 384.235C34.2459 373.227 35.7755 362.025 38.4658 351.32C41.2129 340.345 45.3879 329.726 50.8976 319.698C51.0208 319.471 51.0457 319.208 50.9671 318.964C50.8885 318.719 50.7124 318.513 50.4753 318.387C50.2776 318.262 50.0354 318.216 49.8012 318.257C49.6866 318.286 49.5803 318.338 49.4903 318.41C49.4002 318.482 49.3288 318.572 49.2812 318.673C48.6015 319.912 47.9345 321.151 47.2928 322.405C41.9485 332.845 38.014 343.865 35.5795 355.212C33.2161 366.157 31.9547 377.608 33.1914 388.754Z" fill="white"/>
                        <path d="M597.767 378.983H283.302C280.058 378.98 276.949 377.775 274.655 375.634C272.362 373.492 271.072 370.588 271.068 367.56V11.4232C271.072 8.39466 272.362 5.49109 274.655 3.34956C276.949 1.20802 280.058 0.00340941 283.302 0H597.767C601.01 0.00340941 604.119 1.20802 606.413 3.34956C608.706 5.49109 609.996 8.39466 610 11.4232V367.56C609.996 370.588 608.706 373.492 606.413 375.634C604.119 377.775 601.01 378.98 597.767 378.983ZM283.302 1.34391C280.44 1.34694 277.696 2.40983 275.673 4.29942C273.649 6.189 272.511 8.75097 272.508 11.4232V367.56C272.511 370.232 273.649 372.794 275.673 374.684C277.696 376.573 280.44 377.636 283.302 377.639H597.767C600.628 377.636 603.372 376.573 605.396 374.684C607.419 372.794 608.557 370.232 608.561 367.56V11.4232C608.557 8.75097 607.419 6.189 605.396 4.29942C603.372 2.40983 600.628 1.34694 597.767 1.34391H283.302Z" fill="#3F3D56"/>
                        <path d="M609.28 27.9469H271.788V29.2908H609.28V27.9469Z" fill="#3F3D56"/>
                        <path d="M288.339 20.1586C291.518 20.1586 294.096 17.7519 294.096 14.783C294.096 11.8141 291.518 9.40735 288.339 9.40735C285.159 9.40735 282.582 11.8141 282.582 14.783C282.582 17.7519 285.159 20.1586 288.339 20.1586Z" fill="#3F3D56"/>
                        <path d="M306.329 20.1586C309.508 20.1586 312.086 17.7519 312.086 14.783C312.086 11.8141 309.508 9.40735 306.329 9.40735C303.15 9.40735 300.572 11.8141 300.572 14.783C300.572 17.7519 303.15 20.1586 306.329 20.1586Z" fill="#3F3D56"/>
                        <path d="M324.319 20.1586C327.498 20.1586 330.076 17.7519 330.076 14.783C330.076 11.8141 327.498 9.40735 324.319 9.40735C321.139 9.40735 318.562 11.8141 318.562 14.783C318.562 17.7519 321.139 20.1586 324.319 20.1586Z" fill="#3F3D56"/>
                        <path d="M549.021 81.3067H324.506C322.025 81.3067 319.645 80.3863 317.891 78.7481C316.137 77.1099 315.151 74.888 315.151 72.5712C315.151 70.2545 316.137 68.0326 317.891 66.3944C319.645 64.7562 322.025 63.8358 324.506 63.8358H549.021C551.502 63.8358 553.882 64.7562 555.636 66.3944C557.39 68.0326 558.376 70.2545 558.376 72.5712C558.376 74.888 557.39 77.1099 555.636 78.7481C553.882 80.3863 551.502 81.3067 549.021 81.3067ZM324.506 65.1797C322.407 65.1797 320.393 65.9585 318.909 67.3447C317.424 68.7308 316.59 70.6109 316.59 72.5712C316.59 74.5316 317.424 76.4116 318.909 77.7978C320.393 79.184 322.407 79.9628 324.506 79.9628H549.021C551.121 79.9628 553.134 79.184 554.618 77.7978C556.103 76.4116 556.937 74.5316 556.937 72.5712C556.937 70.6109 556.103 68.7308 554.618 67.3447C553.134 65.9585 551.121 65.1797 549.021 65.1797H324.506Z" fill="#3F3D56"/>
                        <path d="M408.512 204.275H320.001C316.758 204.271 313.649 203.067 311.355 200.925C309.062 198.783 307.772 195.88 307.768 192.851V124.984C307.772 121.955 309.062 119.052 311.355 116.91C313.649 114.769 316.758 113.564 320.001 113.561H408.512C411.755 113.564 414.865 114.769 417.158 116.91C419.452 119.052 420.742 121.955 420.745 124.984V192.851C420.742 195.88 419.452 198.783 417.158 200.925C414.865 203.067 411.755 204.271 408.512 204.275ZM320.001 114.904C317.14 114.907 314.396 115.97 312.372 117.86C310.349 119.75 309.211 122.312 309.207 124.984V192.851C309.211 195.524 310.349 198.086 312.372 199.975C314.396 201.865 317.14 202.928 320.001 202.931H408.512C411.374 202.928 414.118 201.865 416.141 199.975C418.165 198.086 419.303 195.524 419.306 192.851V124.984C419.303 122.312 418.165 119.75 416.141 117.86C414.118 115.97 411.374 114.907 408.512 114.904H320.001Z" fill="#3F3D56"/>
                        <path d="M561.067 116.92H472.556C466.197 116.92 461.042 121.734 461.042 127.672V195.539C461.042 201.477 466.197 206.29 472.556 206.29H561.067C567.426 206.29 572.581 201.477 572.581 195.539V127.672C572.581 121.734 567.426 116.92 561.067 116.92Z" fill="#F2F2F2"/>
                        <path d="M408.512 330.602H320.001C316.758 330.599 313.649 329.394 311.355 327.253C309.062 325.111 307.772 322.208 307.768 319.179V251.311C307.772 248.283 309.062 245.379 311.355 243.238C313.649 241.096 316.758 239.892 320.001 239.888H408.512C411.755 239.892 414.865 241.096 417.158 243.238C419.452 245.379 420.742 248.283 420.745 251.311V319.179C420.742 322.208 419.452 325.111 417.158 327.253C414.865 329.394 411.755 330.599 408.512 330.602ZM320.001 241.232C317.14 241.235 314.396 242.298 312.372 244.188C310.349 246.077 309.211 248.639 309.207 251.311V319.179C309.211 321.851 310.349 324.413 312.372 326.303C314.396 328.192 317.14 329.255 320.001 329.258H408.512C411.374 329.255 414.118 328.192 416.141 326.303C418.165 324.413 419.303 321.851 419.306 319.179V251.311C419.303 248.639 418.165 246.077 416.141 244.188C414.118 242.298 411.374 241.235 408.512 241.232H320.001Z" fill="#3F3D56"/>
                        <path d="M561.067 243.248H472.556C466.197 243.248 461.042 248.062 461.042 253.999V321.867C461.042 327.805 466.197 332.618 472.556 332.618H561.067C567.426 332.618 572.581 327.805 572.581 321.867V253.999C572.581 248.062 567.426 243.248 561.067 243.248Z" fill="#F2F2F2"/>
                        <path d="M342.231 187.861C342.215 187.861 342.199 187.86 342.183 187.86L332.116 187.511C331.802 187.503 331.502 187.388 331.271 187.189C331.041 186.99 330.895 186.719 330.862 186.428C330.169 180.655 327.317 151.237 339.263 139.01C340.954 137.244 343.044 135.852 345.383 134.935C347.721 134.018 350.249 133.598 352.783 133.706C352.886 133.713 352.988 133.692 353.08 133.648C353.171 133.603 353.248 133.536 353.302 133.454L355.739 129.877C355.872 129.684 356.061 129.529 356.284 129.43C356.507 129.331 356.755 129.293 357 129.319C358.954 129.54 368.914 130.58 373.102 129.448C373.349 129.38 373.612 129.381 373.858 129.452C374.104 129.523 374.323 129.66 374.486 129.846L377.686 133.498C377.741 133.564 377.812 133.617 377.894 133.652C377.975 133.687 378.064 133.704 378.154 133.7C379.781 133.67 385.489 133.964 390.484 139.181C395.893 144.83 401.475 157.577 397.351 186.215C397.308 186.51 397.153 186.779 396.914 186.975C396.674 187.171 396.368 187.279 396.05 187.28H388.121C387.806 187.279 387.502 187.172 387.264 186.98C387.026 186.788 386.87 186.522 386.823 186.232L384.233 169.543C384.212 169.406 384.136 169.281 384.021 169.193C383.905 169.106 383.759 169.062 383.611 169.071C383.463 169.079 383.324 169.139 383.221 169.239C383.118 169.339 383.059 169.472 383.056 169.61L382.877 177.446C382.872 177.678 382.796 177.905 382.658 178.098C382.52 178.292 382.326 178.445 382.098 178.539C379.272 179.7 364.337 185.143 347.829 178.326C347.606 178.232 347.415 178.082 347.277 177.893C347.14 177.704 347.061 177.483 347.05 177.255L346.726 170.135C346.719 169.996 346.657 169.865 346.551 169.767C346.446 169.669 346.304 169.612 346.155 169.607C346.006 169.602 345.861 169.65 345.748 169.741C345.635 169.832 345.563 169.959 345.547 170.097L343.534 186.773C343.497 187.072 343.344 187.347 343.104 187.548C342.863 187.748 342.553 187.859 342.231 187.861Z" fill="#21326D"/>
                        <path d="M383.877 310.806H383.869L344.42 310.572C344.133 310.57 343.857 310.471 343.643 310.292C343.43 310.113 343.293 309.868 343.259 309.602L339.291 278.105C339.267 277.902 339.165 277.714 339.004 277.575C338.843 277.437 338.633 277.357 338.415 277.352C335.283 277.256 327.832 276.59 326.288 272.471C324.912 268.803 328.674 263.393 337.467 256.39C337.616 256.271 337.796 256.188 337.988 256.15C338.181 256.112 338.38 256.12 338.569 256.172C338.758 256.225 338.929 256.32 339.068 256.451C339.207 256.581 339.308 256.742 339.363 256.918L343.928 271.624C343.984 271.8 344.099 271.956 344.256 272.067C344.413 272.178 344.604 272.239 344.801 272.241L382.205 272.475C382.401 272.477 382.592 272.42 382.751 272.312C382.909 272.204 383.026 272.052 383.084 271.877L388.163 256.786C388.22 256.617 388.319 256.464 388.452 256.339C388.585 256.214 388.749 256.121 388.929 256.068C389.109 256.014 389.301 256.002 389.487 256.032C389.673 256.063 389.849 256.134 389.999 256.242C393.465 258.713 404.63 267.199 402.792 272.627C401.829 275.469 397.488 277.053 389.889 277.336C389.671 277.343 389.463 277.423 389.303 277.561C389.142 277.7 389.04 277.887 389.016 278.09L385.046 309.834C385.012 310.102 384.875 310.349 384.66 310.528C384.444 310.707 384.165 310.806 383.877 310.806Z" fill="#21326D"/>
                        <path d="M556.75 178.171C544.353 180.4 532.663 185.234 522.565 192.309C522.054 191.039 521.092 189.972 519.839 189.286C518.984 188.79 518.05 188.424 517.073 188.2C516.184 187.989 515.329 188.493 514.545 189.221C513.642 190.153 512.885 191.2 512.295 192.33C498.748 183.647 478.198 178.106 478.198 178.106V176.37C478.214 175.96 478.259 175.552 478.331 175.149C478.401 174.682 478.488 174.269 478.599 173.765C480.342 165.483 487.235 146.559 487.235 146.559H495.029L510.139 149.49L527.139 148.518L544.26 145.192L546.48 144.758C550.182 147.471 554.384 166.465 556.035 174.552C556.244 175.577 556.407 176.424 556.529 177.048C556.674 177.753 556.75 178.171 556.75 178.171Z" fill="white"/>
                        <path d="M510.246 261.538C510.246 261.538 506.626 262.383 501.012 276.582C495.398 290.782 493.409 309.128 493.409 309.128C493.409 309.128 490.252 314.119 503.727 314.454C503.727 314.454 502.643 317.75 510.246 317.244C517.849 316.738 516.755 316.743 516.755 316.743C516.755 316.743 521.643 313.869 523.816 314.375C525.989 314.881 527.346 315.053 529.698 316.91C532.05 318.767 539.569 318.011 539.658 316.576C539.719 315.871 539.719 315.163 539.658 314.458C539.658 314.458 551.155 315.136 548.982 307.359C546.809 299.581 544.999 286.817 544.999 286.817C544.999 286.817 539.116 261.882 532.413 261.543C525.71 261.204 510.246 261.538 510.246 261.538Z" fill="white"/>
                        <path d="M138.624 237.601C150.547 237.601 160.212 228.576 160.212 217.442C160.212 206.309 150.547 197.284 138.624 197.284C126.701 197.284 117.036 206.309 117.036 217.442C117.036 228.576 126.701 237.601 138.624 237.601Z" fill="#2F2E41"/>
                        <path d="M140.437 237.639C150.198 237.639 158.111 230.25 158.111 221.135C158.111 212.021 150.198 204.631 140.437 204.631C130.676 204.631 122.763 212.021 122.763 221.135C122.763 230.25 130.676 237.639 140.437 237.639Z" fill="#FFB8B8"/>
                        <path d="M207.748 271.334C207.467 271.598 207.209 271.882 206.976 272.183L171.311 271.006L167.232 263.863L154.882 268.202L160.787 281.504C161.264 282.579 162.102 283.48 163.174 284.072C164.246 284.664 165.495 284.916 166.733 284.789L207.092 280.651C208.029 281.785 209.314 282.625 210.776 283.06C212.237 283.495 213.806 283.504 215.273 283.086C216.741 282.668 218.037 281.843 218.99 280.721C219.942 279.598 220.507 278.231 220.607 276.802C220.708 275.373 220.34 273.949 219.553 272.719C218.766 271.49 217.596 270.514 216.2 269.92C214.804 269.326 213.248 269.144 211.738 269.396C210.228 269.649 208.836 270.325 207.748 271.334H207.748Z" fill="#FFB8B8"/>
                        <path d="M150.131 274.626C149.677 274.435 149.271 274.156 148.943 273.806C148.615 273.456 148.372 273.044 148.229 272.598L143.262 257.029C142.183 254.873 142.064 252.406 142.931 250.168C143.797 247.93 145.579 246.104 147.885 245.091C150.19 244.078 152.833 243.96 155.232 244.763C157.631 245.566 159.591 247.224 160.682 249.375L170.305 262.972C170.579 263.36 170.761 263.799 170.838 264.258C170.914 264.718 170.884 265.187 170.749 265.635C170.613 266.083 170.376 266.498 170.054 266.852C169.731 267.207 169.331 267.492 168.879 267.689L153.018 274.606C152.566 274.803 152.075 274.907 151.577 274.91C151.078 274.913 150.585 274.816 150.131 274.626Z" fill="#CCCCCC"/>
                        <path d="M185.258 432.691L193.007 428.752L180.425 398.969L168.989 404.782L185.258 432.691Z" fill="#FFB8B8"/>
                        <path d="M181.905 431.333L197.164 423.576L197.165 423.576C198.442 422.926 199.843 422.518 201.289 422.375C202.735 422.232 204.197 422.356 205.592 422.74C206.986 423.124 208.286 423.761 209.417 424.614C210.548 425.468 211.488 426.521 212.183 427.713L212.355 428.008L187.371 440.709L181.905 431.333Z" fill="#2F2E41"/>
                        <path d="M99.9948 432.723H108.816L113.014 400.947L99.9927 400.948L99.9948 432.723Z" fill="#FFB8B8"/>
                        <path d="M97.7444 430.033L115.118 430.033H115.119C116.573 430.033 118.013 430.3 119.356 430.82C120.699 431.339 121.92 432.101 122.948 433.061C123.976 434.021 124.792 435.161 125.348 436.415C125.905 437.669 126.191 439.014 126.191 440.372V440.708L97.7449 440.709L97.7444 430.033Z" fill="#2F2E41"/>
                        <path d="M154.815 291.693L157.693 323.947L189.801 413.892C189.927 414.246 189.973 414.621 189.936 414.992C189.899 415.363 189.78 415.723 189.585 416.049C189.391 416.375 189.127 416.66 188.808 416.885C188.49 417.11 188.125 417.271 187.737 417.357L177.896 419.545C177.266 419.685 176.604 419.623 176.016 419.368C175.429 419.113 174.951 418.68 174.659 418.14L133.61 342.107C133.477 341.859 133.264 341.656 133.002 341.525C132.739 341.395 132.44 341.343 132.145 341.378C131.85 341.413 131.574 341.532 131.355 341.719C131.135 341.906 130.983 342.152 130.92 342.423L112.855 419.269C112.714 419.868 112.359 420.404 111.847 420.788C111.336 421.172 110.7 421.381 110.043 421.381H100.889C100.507 421.381 100.13 421.311 99.7781 421.174C99.4263 421.036 99.1072 420.835 98.8395 420.582C98.5718 420.328 98.3609 420.027 98.2189 419.697C98.077 419.366 98.0069 419.013 98.0128 418.657C98.8517 365.373 96.0843 304.657 118.115 295.053L121.713 286.318L154.815 291.693Z" fill="#2F2E41"/>
                        <path d="M120.677 288.605L116.967 267.655C116.353 264.22 116.675 260.695 117.904 257.406C119.132 254.117 121.228 251.17 123.997 248.837C126.704 246.525 129.99 244.888 133.553 244.074C137.116 243.261 140.841 243.299 144.384 244.183C144.594 244.236 144.805 244.29 145.016 244.345C149.375 245.511 153.247 247.898 156.108 251.184C158.968 254.47 160.679 258.497 161.011 262.721C161.719 271.819 161.085 285.019 154.046 296.231L153.91 296.449L120.677 288.605Z" fill="#CCCCCC"/>
                        <path d="M158.019 212.364C153.98 214.963 149.187 216.346 144.282 216.328C146.031 217.461 148.023 218.226 150.12 218.571C143.598 219.877 136.858 219.913 130.321 218.675C128.868 218.457 127.466 218.008 126.176 217.346C125.534 217.011 124.974 216.553 124.533 216.002C124.092 215.452 123.781 214.821 123.618 214.151C123.184 211.834 125.117 209.728 127.127 208.309C130.203 206.17 133.751 204.696 137.512 203.994C141.274 203.293 145.155 203.38 148.876 204.251C151.306 204.837 153.74 205.828 155.318 207.65C156.896 209.472 157.363 212.281 155.86 214.157L158.019 212.364Z" fill="#2F2E41"/>
                        <path d="M138.34 197.184C140.388 189.459 133.045 180.877 124.525 181.038C115.88 181.201 109.518 188.496 105.145 195.461C100.772 202.426 96.4264 210.322 88.3982 213.321C85.7416 214.313 82.8628 214.675 80.0198 214.372C77.1769 214.07 74.4587 213.114 72.1091 211.589C69.7594 210.064 67.8516 208.019 66.5568 205.636C65.262 203.254 64.6207 200.608 64.6903 197.937C63.6124 206.399 65.1057 215.555 70.9499 222.1C76.7941 228.646 87.6686 231.595 95.4849 227.197C99.949 224.685 102.802 220.318 105.155 215.975C107.507 211.632 109.6 207.052 113.165 203.501C116.729 199.95 122.241 197.593 127.201 199.087C129.17 199.68 130.937 200.836 132.971 201.188C135.005 201.539 137.566 200.637 137.844 198.722L138.34 197.184Z" fill="#2F2E41"/>
                        <path d="M95.7419 337.248C95.0084 336.445 94.4722 335.502 94.1713 334.485C93.8703 333.468 93.8118 332.401 94 331.361C94.1881 330.32 94.6183 329.331 95.2603 328.462C95.9022 327.594 96.7403 326.867 97.7155 326.334L113.047 262.164L128.599 268.125L108.639 329.327C109.489 330.916 109.687 332.742 109.192 334.458C108.698 336.173 107.548 337.66 105.958 338.637C104.368 339.613 102.45 340.011 100.567 339.755C98.6845 339.499 96.9676 338.607 95.7419 337.248H95.7419Z" fill="#FFB8B8"/>
                        <path d="M106.972 271.37C106.728 270.965 106.579 270.515 106.537 270.051C106.496 269.588 106.561 269.122 106.73 268.684L112.626 253.4C113.128 251.067 114.6 249.015 116.719 247.694C118.839 246.372 121.434 245.89 123.934 246.352C126.434 246.815 128.635 248.184 130.056 250.16C131.476 252.135 132 254.557 131.512 256.892L130.616 273.168C130.591 273.633 130.458 274.087 130.228 274.499C129.997 274.912 129.674 275.273 129.281 275.558C128.888 275.843 128.433 276.046 127.948 276.153C127.463 276.259 126.96 276.267 126.471 276.175L109.308 272.953C108.82 272.862 108.358 272.673 107.955 272.4C107.552 272.126 107.217 271.775 106.972 271.37Z" fill="#CCCCCC"/>
                        <path d="M232.586 264.173L232.33 264.14L233.292 257.607C233.44 256.604 233.154 255.588 232.499 254.781C231.844 253.974 230.873 253.444 229.799 253.306L214.976 251.403C213.902 251.265 212.813 251.531 211.949 252.143C211.085 252.755 210.517 253.662 210.369 254.665L205.093 290.507C204.945 291.51 205.23 292.526 205.885 293.333C206.541 294.14 207.512 294.67 208.586 294.808L223.409 296.711C224.483 296.849 225.572 296.583 226.436 295.971C227.3 295.359 227.868 294.452 228.015 293.449L231.646 268.791L231.901 268.823L232.586 264.173Z" fill="#3F3D56"/>
                        <path d="M229.333 255.223L227.488 254.986C227.544 255.191 227.545 255.406 227.492 255.612C227.438 255.817 227.331 256.008 227.18 256.166C227.029 256.324 226.839 256.445 226.626 256.518C226.413 256.591 226.184 256.615 225.959 256.586L217.859 255.546C217.634 255.517 217.421 255.437 217.237 255.313C217.053 255.189 216.905 255.024 216.805 254.834C216.705 254.644 216.657 254.434 216.665 254.222C216.673 254.01 216.736 253.804 216.85 253.62L215.126 253.399C214.747 253.35 214.362 253.372 213.992 253.462C213.622 253.553 213.275 253.71 212.97 253.926C212.665 254.142 212.409 254.411 212.216 254.72C212.023 255.028 211.897 255.368 211.845 255.722L206.819 289.86C206.767 290.214 206.79 290.574 206.887 290.919C206.984 291.265 207.153 291.589 207.384 291.873C207.615 292.158 207.903 292.397 208.233 292.577C208.564 292.758 208.928 292.875 209.307 292.924L223.515 294.748C224.28 294.846 225.055 294.656 225.67 294.221C226.286 293.785 226.69 293.139 226.796 292.424L231.821 258.286C231.926 257.572 231.723 256.848 231.257 256.273C230.79 255.699 230.098 255.321 229.333 255.223L229.333 255.223Z" fill="white"/>
                        <path d="M219.257 283.565C223.629 283.565 227.173 280.256 227.173 276.174C227.173 272.092 223.629 268.782 219.257 268.782C214.885 268.782 211.342 272.092 211.342 276.174C211.342 280.256 214.885 283.565 219.257 283.565Z" fill="#21326D"/>
                        <path d="M218.473 278.994C218.294 278.994 218.121 278.94 217.979 278.84L217.97 278.834L216.109 277.504C216.023 277.443 215.95 277.366 215.896 277.278C215.841 277.19 215.805 277.093 215.791 276.993C215.777 276.892 215.784 276.79 215.812 276.692C215.84 276.593 215.888 276.501 215.954 276.421C216.02 276.34 216.103 276.273 216.197 276.222C216.291 276.171 216.395 276.138 216.503 276.125C216.611 276.112 216.72 276.119 216.825 276.145C216.93 276.172 217.029 276.217 217.115 276.279L218.32 277.142L221.167 273.674C221.233 273.594 221.315 273.526 221.409 273.476C221.503 273.425 221.607 273.392 221.715 273.379C221.822 273.365 221.932 273.372 222.037 273.398C222.141 273.425 222.24 273.47 222.326 273.531L222.308 273.554L222.326 273.532C222.5 273.656 222.614 273.84 222.642 274.043C222.671 274.246 222.612 274.451 222.479 274.614L219.13 278.692C219.053 278.786 218.953 278.862 218.839 278.915C218.725 278.967 218.6 278.994 218.473 278.994Z" fill="white"/>
                        <path d="M292.211 440.803H18.0438C17.853 440.803 17.6699 440.732 17.535 440.606C17.4 440.48 17.3242 440.309 17.3242 440.131C17.3242 439.953 17.4 439.782 17.535 439.656C17.6699 439.53 17.853 439.459 18.0438 439.459H292.211C292.402 439.459 292.585 439.53 292.72 439.656C292.855 439.782 292.931 439.953 292.931 440.131C292.931 440.309 292.855 440.48 292.72 440.606C292.585 440.732 292.402 440.803 292.211 440.803Z" fill="#3F3D56"/>
                        </g>
                        <defs>
                        <clipPath id="clip0">
                        <rect width="610" height="440.803" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className="user-login">
                    <div className="user-login-header">
                        <h3 className="user-login-title">Welcome back</h3>
                        <p className="user-login-subtitle">Let's spend those bags</p>
                    </div>
                    <form className="user-login-form">
                        <input type='email' name="email" placeholder="Email" onChange={handleFormChange} className="form-input" required/>
                        <input type='password' name="password" placeholder="Password" onChange={handleFormChange} className="form-input" required/>
                        <input type='submit' value="Login" onClick={submitForm} className="submit-btn login-btn"/>
                    </form>
                    <p className="user-signup-link">
                        Don't have an account? 
                        <span>
                            <Link to="/signup">Click here</Link>
                        </span>
                    </p>
                </div>
            </main>
            <Footer/>  
        </div>
    )
}

export default UserLogin;