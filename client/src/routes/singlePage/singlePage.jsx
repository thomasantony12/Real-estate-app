import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData } from "react-router-dom";
import DOMpurify from "dompurify";

function SinglePage() {
  const posts = useLoaderData();
  console.log(posts);
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={posts.images || "./noavatar.jpg"} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{posts.title || "Not Specified"}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{posts.address || "Not Specified"}</span>
                </div>
                <div className="price">$ {posts.price || "Not Specified"}</div>
              </div>
              <div className="user">
                <img src={posts.avatar || "Not Specified"} alt="" />
                <span>{posts.uname || "Not Specified"}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={ {__html: DOMpurify.sanitize(posts.description)}}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {posts.utilities === "owner" ? 
                  (<p>Owner is responsible</p> ) :
                  (<p>Tenant is responsible</p>)
              }
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                { posts.pet === "allowed" ? 
                ( <p> Allowed </p> ) 
                : ( <p> Not allowed </p> ) }
               
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Property Fees</span>
                <p>{posts.income || "Not Specified"}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{posts.size || "Not Specified"} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{posts.bedroom || "Not Specified"} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{posts.bathroom || "Not Specified"} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{posts.school || "Not Specified"} km away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{posts.bus || "Not Specified"} km away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{posts.restaurant || "Not Specified"} km away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[posts]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button>
              <img src="/save.png" alt="" />
              Save the Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
