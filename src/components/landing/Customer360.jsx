import React from 'react';

export default function Customer360() {
  const treeNodes = ['Customer Profile', 'Account Details', 'Projects', 'Deals', 'Quotations', 'Orders', 'Support History'];

  return (
    <section className="lp-section lp-section-alt" id="solutions">
      <div className="lp-container">
        <div className="lp-section-header">
          <div className="lp-badge">360° Intelligence</div>
          <h2 className="lp-heading-2">Know Your Customers. Understand Your Business.</h2>
          <p className="lp-subheading">
            Connect disparate interactions into a single comprehensive view of every client account.
          </p>
        </div>

        {/* Velocity Scroll Left-to-Right Moving Marquee */}
        <div className="lp-marquee-container">
          <div className="lp-marquee-track-ltr-velocity">
            {[...treeNodes, ...treeNodes, ...treeNodes, ...treeNodes].map((node, i) => (
              <React.Fragment key={i}>
                <div className="lp-tree-node">
                  {node}
                </div>
                <span className="lp-tree-arrow">➔</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
