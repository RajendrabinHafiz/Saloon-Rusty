import React, {createRef} from 'react'
import ReCAPTCHA from "react-google-recaptcha";

// requestInventory
class Main extends React.Component {

    constructor (props) {
        super(props);
        this.captcha = createRef();
    }


    send = () => {
        // const recaptchaValue = this.captcha.current.getValue();
        // // console.log("Captcha", recaptchaValue);
        // this.captcha.current.reset();
        // this.props.submit(recaptchaValue);
    }

    render () {
        return null;
        return (
            <ReCAPTCHA
                sitekey="6LdCXfkdAAAAACLaCEaFZvBRNyau410x0ibgx2l3"
                // sitekey="6Ldrf6wZAAAAAP9TRkdhz3DguPJyb4jpsW_uMdf5"
                ref={this.captcha}
                onChange={this.send}
            />
        )
    }
}

export default Main;