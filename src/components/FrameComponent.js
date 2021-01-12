import React from "react";
import { useSelector } from "react-redux";
function FrameComponent(props) {
    const [imgSrc, setImgSrc] = React.useState("");
    const frameState = useSelector((state) => state.frame);


    React.useEffect(() => {
        setImgSrc(frameState[props.camera_code]);

    }, [frameState[props.camera_code]]);
    return (
        <div style={{
            'backgroundImage': 'url("https://images.drivereasy.com/wp-content/uploads/2017/04/1-14.jpg")',
            'backgroundPosition': 'center',
            'backgroundRepeat': 'no-repeat',
            'backgroundSize': 'cover',
            'minHeight': '300px',
            'padding': '10px'
        }}>

            <img style={{ 'width': '100%', 'textIndent': '-10000px' }} alt='' src={`${imgSrc}`} />

        </div>
    );
}

export { FrameComponent };
