/**
 * Claim Repository Implementation (Prisma)
 */

import { PrismaClient } from "../../../../../generated/prisma-client";
import { Claim } from "../../../domain/claim/entities/Claim";
import { IClaimRepository } from "../../../domain/claim/repositories/IClaimRepository";
import { DatabaseError } from "../../../shared/errors/DomainError";

export class ClaimRepository implements IClaimRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(claim: Claim): Promise<void> {
    try {
      const data = claim.toPersistence();

      await this.prisma.claim.create({
        data: {
          id: data.id,
          runId: data.runId,
          sourceId: data.sourceId,
          text: data.text,
          claimType: data.claimType,
          category: data.category,
          confidence: data.confidence,
          trustScore: data.trustScore?.getValue(),
          evidenceCount: data.evidenceCount,
          isVerified: data.isVerified,
          verifiedBy: data.verifiedBy,
          verifiedAt: data.verifiedAt,
          hasContradiction: data.hasContradiction,
          contradictedBy: data.contradictedBy,
          extractedBy: data.extractedBy,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to save claim: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async saveMany(claims: Claim[]): Promise<void> {
    try {
      const data = claims.map((claim) => {
        const p = claim.toPersistence();
        return {
          id: p.id,
          runId: p.runId,
          sourceId: p.sourceId,
          text: p.text,
          claimType: p.claimType,
          category: p.category,
          confidence: p.confidence,
          trustScore: p.trustScore?.getValue(),
          evidenceCount: p.evidenceCount,
          isVerified: p.isVerified,
          verifiedBy: p.verifiedBy,
          verifiedAt: p.verifiedAt,
          hasContradiction: p.hasContradiction,
          contradictedBy: p.contradictedBy,
          extractedBy: p.extractedBy,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      });

      await this.prisma.claim.createMany({ data });
    } catch (error) {
      throw new DatabaseError(
        `Failed to save claims: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findById(id: string): Promise<Claim | null> {
    try {
      const claim = await this.prisma.claim.findUnique({
        where: { id },
      });

      if (!claim) return null;

      return Claim.fromPersistence({
        id: claim.id,
        runId: claim.runId,
        sourceId: claim.sourceId || undefined,
        text: claim.text,
        claimType: claim.claimType as any,
        category: claim.category as any,
        confidence: claim.confidence,
        trustScore: claim.trustScore !== null ? { getValue: () => claim.trustScore! } as any : undefined,
        evidenceCount: claim.evidenceCount,
        isVerified: claim.isVerified,
        verifiedBy: claim.verifiedBy || undefined,
        verifiedAt: claim.verifiedAt || undefined,
        hasContradiction: claim.hasContradiction,
        contradictedBy: claim.contradictedBy,
        extractedBy: claim.extractedBy,
        createdAt: claim.createdAt,
        updatedAt: claim.updatedAt,
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to find claim: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findByRunId(runId: string): Promise<Claim[]> {
    try {
      const claims = await this.prisma.claim.findMany({
        where: { runId },
        orderBy: { createdAt: "asc" },
      });

      return claims.map((claim) =>
        Claim.fromPersistence({
          id: claim.id,
          runId: claim.runId,
          sourceId: claim.sourceId || undefined,
          text: claim.text,
          claimType: claim.claimType as any,
          category: claim.category as any,
          confidence: claim.confidence,
          trustScore: claim.trustScore !== null ? { getValue: () => claim.trustScore! } as any : undefined,
          evidenceCount: claim.evidenceCount,
          isVerified: claim.isVerified,
          verifiedBy: claim.verifiedBy || undefined,
          verifiedAt: claim.verifiedAt || undefined,
          hasContradiction: claim.hasContradiction,
          contradictedBy: claim.contradictedBy,
          extractedBy: claim.extractedBy,
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt,
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to find claims by run ID: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async update(claim: Claim): Promise<void> {
    try {
      const data = claim.toPersistence();

      await this.prisma.claim.update({
        where: { id: data.id },
        data: {
          trustScore: data.trustScore?.getValue(),
          evidenceCount: data.evidenceCount,
          isVerified: data.isVerified,
          verifiedBy: data.verifiedBy,
          verifiedAt: data.verifiedAt,
          hasContradiction: data.hasContradiction,
          contradictedBy: data.contradictedBy,
          updatedAt: data.updatedAt,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to update claim: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.claim.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete claim: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findClaimsWithContradictions(runId: string): Promise<Claim[]> {
    try {
      const claims = await this.prisma.claim.findMany({
        where: {
          runId,
          hasContradiction: true,
        },
        orderBy: { createdAt: "asc" },
      });

      return claims.map((claim) =>
        Claim.fromPersistence({
          id: claim.id,
          runId: claim.runId,
          sourceId: claim.sourceId || undefined,
          text: claim.text,
          claimType: claim.claimType as any,
          category: claim.category as any,
          confidence: claim.confidence,
          trustScore: claim.trustScore !== null ? { getValue: () => claim.trustScore! } as any : undefined,
          evidenceCount: claim.evidenceCount,
          isVerified: claim.isVerified,
          verifiedBy: claim.verifiedBy || undefined,
          verifiedAt: claim.verifiedAt || undefined,
          hasContradiction: claim.hasContradiction,
          contradictedBy: claim.contradictedBy,
          extractedBy: claim.extractedBy,
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt,
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to find claims with contradictions: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findLowTrustClaims(runId: string, threshold: number): Promise<Claim[]> {
    try {
      const claims = await this.prisma.claim.findMany({
        where: {
          runId,
          trustScore: {
            lt: threshold,
          },
        },
        orderBy: { trustScore: "asc" },
      });

      return claims.map((claim) =>
        Claim.fromPersistence({
          id: claim.id,
          runId: claim.runId,
          sourceId: claim.sourceId || undefined,
          text: claim.text,
          claimType: claim.claimType as any,
          category: claim.category as any,
          confidence: claim.confidence,
          trustScore: claim.trustScore !== null ? { getValue: () => claim.trustScore! } as any : undefined,
          evidenceCount: claim.evidenceCount,
          isVerified: claim.isVerified,
          verifiedBy: claim.verifiedBy || undefined,
          verifiedAt: claim.verifiedAt || undefined,
          hasContradiction: claim.hasContradiction,
          contradictedBy: claim.contradictedBy,
          extractedBy: claim.extractedBy,
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt,
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to find low-trust claims: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}
