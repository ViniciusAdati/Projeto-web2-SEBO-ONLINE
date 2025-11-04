import React from "react";
import type { IconType } from "react-icons";
import "../styles/SummaryCard.css";

interface SummaryCardProps {
  title: string;
  value: number;
  Icon: IconType;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, Icon }) => {
  return (
    <div className="summary-card">
      <div className="card-header">
        <p className="card-title">{title}</p>
        <Icon className="card-icon" />
      </div>
      <h2 className="card-value">{value}</h2>
    </div>
  );
};

export default SummaryCard;
