/**
 * Claim Repository Interface (Domain Layer)
 */

import { Claim } from "../entities/Claim";

export interface IClaimRepository {
  /**
   * Save a claim
   */
  save(claim: Claim): Promise<void>;

  /**
   * Save multiple claims (batch)
   */
  saveMany(claims: Claim[]): Promise<void>;

  /**
   * Find claim by ID
   */
  findById(id: string): Promise<Claim | null>;

  /**
   * Find claims by run ID
   */
  findByRunId(runId: string): Promise<Claim[]>;

  /**
   * Update claim
   */
  update(claim: Claim): Promise<void>;

  /**
   * Delete claim
   */
  delete(id: string): Promise<void>;

  /**
   * Find claims with contradictions
   */
  findClaimsWithContradictions(runId: string): Promise<Claim[]>;

  /**
   * Find low-trust claims
   */
  findLowTrustClaims(runId: string, threshold: number): Promise<Claim[]>;
}
