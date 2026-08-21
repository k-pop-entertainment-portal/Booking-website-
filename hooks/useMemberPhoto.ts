import { useEffect, useState } from "react";
import {
  getMemberPhoto,
  subscribePhotos,
  neutralPhotoFor,
} from "../utils/memberPhotos";

export interface PhotoState {
  /** photo to render right now (never empty) */
  src: string;
  /** true while the real member photo is still resolving */
  loading: boolean;
  /** true when this is a real photo of the group's members */
  isReal: boolean;
}

/**
 * Resolves a REAL photo of the group's actual members.
 * Falls back to a neutral K-pop event photo (no artists shown)
 * when no member photo is available.
 */
export function useMemberPhoto(name: string): PhotoState {
  const [url, setUrl] = useState<string | null | undefined>(() =>
    getMemberPhoto(name)
  );

  useEffect(() => {
    setUrl(getMemberPhoto(name));
    const off = subscribePhotos((n, u) => {
      if (n === name) setUrl(u);
    });
    return off;
  }, [name]);

  if (url === undefined) {
    return { src: neutralPhotoFor(name), loading: true, isReal: false };
  }
  if (url === null) {
    return { src: neutralPhotoFor(name), loading: false, isReal: false };
  }
  return { src: url, loading: false, isReal: true };
}
