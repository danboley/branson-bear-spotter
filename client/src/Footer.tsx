import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  windowWidth: number;
}

const Footer: React.FC<FooterProps> = ({ windowWidth }) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-main text-text-light p-4 border-t-2 border-white">
      <div className="text-center flex justify-center space-x-8">
        {windowWidth >= 900 ? (
          <h4 className="">
            © {currentYear} Branson Bear. All rights reserved. Branson Bear &
            Branson Dempster are registered trademarks of Cold Smoke LLC, which
            is a registered trademark of Shredder Corp.
          </h4>
        ) : null}
      </div>
      {windowWidth < 900 ? (
        <h4 className="text-center pt-4">
          © {currentYear} Branson Bear. All rights reserved. Branson Bear &
          Branson Dempster are registered trademarks of Cold Smoke LLC, which is
          a registered trademark of Shredder Corp.
        </h4>
      ) : null}
    </div>
  );
};

export default Footer;
