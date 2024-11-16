import Image from "../nillkin-case.webp";
import {Link} from "react-router-dom";

function FeatureProduct() {
  return (
      <div className="col">
        <div className="card shadow-sm border-0">
          <img
              className="card-img-top cover"
              height="240"
              alt=""
              src={Image}
              style={{
                backgroundColor: "#1a1a1a",
                objectFit: "cover",
                filter: "brightness(0.85)",
              }}
          />
          <div className="card-body bg-dark text-light">
            <h5 className="card-title text-center text-orange">Nillkin iPhone X cover</h5>
            <p className="card-text text-center text-muted">10000 Ks</p>
            <div className="d-grid gap-2">
              <Link
                  to="/products/1"
                  className="btn btn-outline-orange"
                  replace
                  style={{
                    borderColor: "#FFA500",
                    color: "#FFA500",
                  }}
              >
                Detail
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}

export default FeatureProduct;
