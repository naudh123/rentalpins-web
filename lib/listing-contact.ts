/** Listing contact verification display (web unverified-contact rollout). */

export function isOwnerPhoneVerified(
  ownerPhoneVerified: boolean | undefined
): boolean {
  return ownerPhoneVerified === true;
}

/** Show badge only when explicitly marked unverified (new web drafts). */
export function showContactNotVerifiedBadge(listing: {
  ownerPhoneVerified?: boolean;
}): boolean {
  return listing.ownerPhoneVerified === false;
}
