import React from "react";
import Particles from "react-particles-js";

const AuthParticles = () => {
  return (
    <Particles
      className="auth-particle"
      params={{
        fps_limit: 45,
        particles: {
          number: {
            value: 150,
          },
          size: {
            value: 3
          },
          line_linked: {
            color: '#009f3c',
            enable: true,
            width: 1
          },
          shape: {
            type: "circle",
            stroke: {
              color: "#009f3c",
              width: 1
            }
          }
        },
        polygon: {
          draw: {
            stroke: {
              width: 50,
              color: '#009f3c'
            }
          }
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            }
          }
        }
      }}
    />
  )
};

export default AuthParticles;